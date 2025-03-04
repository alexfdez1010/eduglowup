-- This is an empty migration.
INSERT INTO "Experiment" ("id", "name", "description", "startDate", "metric")
      VALUES ('89b2844d-c572-495d-a623-eb4489238f80', 'pricing',
              'Test four different prices (5/10/15/20€)',
              '2024-09-21', 'Number of users');

INSERT INTO "Variant" ("id","name", "experimentId", "probability")
      VALUES ('e13e2526-266e-48a9-bf8a-708de720e06f','5€', '89b2844d-c572-495d-a623-eb4489238f80', 0.25),
             ('f3d75185-350a-47cf-be22-e15c23518685','10€', '89b2844d-c572-495d-a623-eb4489238f80', 0.25),
             ('181497c9-9216-40fe-bf4e-b5a019118ef9','15€', '89b2844d-c572-495d-a623-eb4489238f80', 0.25),
             ('5e4b6daf-719e-469d-9948-c466b974511e','20€', '89b2844d-c572-495d-a623-eb4489238f80', 0.25);