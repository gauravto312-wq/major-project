package com.bizsahayak.scheme;

import com.bizsahayak.scheme.search.SchemeSearchEngine;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class SchemeSpecification {

    public static Specification<Scheme> filterPublicSchemes(
            List<SchemeStatus> statuses,
            String keyword,
            String state,
            String schemeType,
            Long categoryId) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Status Filter
            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            // 2. State Filter
            if (state != null && !state.isBlank()) {
                String cleanState = state.trim().toLowerCase();
                Predicate stateMatch = cb.equal(cb.lower(root.get("state")), cleanState);
                Predicate allIndiaMatch = cb.equal(cb.lower(root.get("state")), "all india");
                predicates.add(cb.or(stateMatch, allIndiaMatch));
            }

            // 3. Scheme Type Filter
            if (schemeType != null && !schemeType.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("schemeType")), schemeType.trim().toLowerCase()));
            }

            // 4. Category Filter
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            // 5. Content-Wide Keyword Search (inspecting all fields + expanded synonyms)
            if (keyword != null && !keyword.isBlank()) {
                Set<String> expandedTokens = SchemeSearchEngine.expandQueryTokens(keyword);
                List<Predicate> keywordPredicates = new ArrayList<>();

                for (String token : expandedTokens) {
                    if (token.length() < 2) continue;
                    String pattern = "%" + token.toLowerCase() + "%";

                    Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                    Predicate shortDescLike = cb.like(cb.lower(root.get("shortDescription")), pattern);
                    Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                    Predicate deptLike = cb.like(cb.lower(root.get("department")), pattern);
                    Predicate ministryLike = cb.like(cb.lower(root.get("ministry")), pattern);
                    Predicate benefitsLike = cb.like(cb.lower(root.get("benefits")), pattern);
                    Predicate eligibilityLike = cb.like(cb.lower(root.get("eligibility")), pattern);
                    Predicate targetIndLike = cb.like(cb.lower(root.get("targetIndustries")), pattern);
                    Predicate targetBusLike = cb.like(cb.lower(root.get("targetBusinessTypes")), pattern);
                    Predicate categoryLike = cb.like(cb.lower(root.get("category").get("name")), pattern);

                    keywordPredicates.add(cb.or(
                            titleLike, shortDescLike, descLike, deptLike, ministryLike,
                            benefitsLike, eligibilityLike, targetIndLike, targetBusLike, categoryLike
                    ));
                }

                if (!keywordPredicates.isEmpty()) {
                    predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
