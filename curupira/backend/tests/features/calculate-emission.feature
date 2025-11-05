Feature: Calculate emission
    Scenario: User request correctly an emission value
        Given user accessed the service
        When he fills the activity name and interval
        Then he should receive the emission