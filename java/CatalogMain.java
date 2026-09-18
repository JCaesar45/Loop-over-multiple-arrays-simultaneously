import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public final class CatalogMain {
    public record Proof(double rating, long sales, double retention) {
        public Proof {
            if (rating < 0 || rating > 5) {
                throw new IllegalArgumentException("rating must be between 0 and 5");
            }

            if (sales < 0) {
                throw new IllegalArgumentException("sales must be non-negative");
            }

            if (retention < 0 || retention > 1) {
                throw new IllegalArgumentException("retention must be between 0 and 1");
            }
        }
    }

    public record Product(
        String id,
        String name,
        String category,
        long priceCents,
        double margin,
        String badge,
        Proof proof,
        List<String> features
    ) {
        public Product {
            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException("id is required");
            }

            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("name is required");
            }

            if (category == null || category.isBlank()) {
                throw new IllegalArgumentException("category is required");
            }

            if (badge == null || badge.isBlank()) {
                throw new IllegalArgumentException("badge is required");
            }

            if (priceCents < 0) {
                throw new IllegalArgumentException("priceCents must be non-negative");
            }

            if (margin < 0 || margin > 1) {
                throw new IllegalArgumentException("margin must be between 0 and 1");
            }

            if (features == null || features.isEmpty()) {
                throw new IllegalArgumentException("features are required");
            }

            features = List.copyOf(features);
        }

        public double conversionScore() {
            double dollars = priceCents / 100.0;
            return (proof.rating() * Math.log1p(proof.sales()) * margin) / Math.sqrt(dollars + 1);
        }
    }

    public static List<Product> catalog() {
        return List.of(
            new Product(
                "velvet-funnel",
                "Velvet Funnel Suite",
                "Conversion",
                260000,
                0.51,
                "Growth",
                new Proof(4.8, 2390, 0.91),
                List.of("A/B revenue pages", "Lead scoring", "Concierge CTA flows")
            ),
            new Product(
                "obsidian-intake",
                "Obsidian Client Intake",
                "Client Intake",
                190000,
                0.39,
                "Intake",
                new Proof(4.7, 3155, 0.96),
                List.of("Verified lead capture", "Pipeline automation", "High-value follow-up")
            ),
            new Product(
                "meridian-retention",
                "Meridian Retention Suite",
                "Retention",
                320000,
                0.45,
                "Retention",
                new Proof(4.8, 968, 0.97),
                List.of("Churn radar", "Loyalty triggers", "Client success briefs")
            ),
            new Product(
                "aurum-signature",
                "Aurum Signature Console",
                "Revenue Command",
                480000,
                0.42,
                "Flagship",
                new Proof(4.9, 1482, 0.94),
                List.of("Real-time revenue telemetry", "Predictive offer ranking", "Private client vault")
            )
        );
    }

    public static List<Product> ranked(List<Product> products) {
        return products.stream()
            .sorted(Comparator.comparingDouble(Product::conversionScore).reversed())
            .toList();
    }

    public static void main(String[] args) {
        ranked(catalog()).forEach(product ->
            System.out.printf(Locale.ROOT, "%s %.4f%n", product.id(), product.conversionScore())
        );
    }
}
