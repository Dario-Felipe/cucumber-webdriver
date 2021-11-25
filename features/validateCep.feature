Feature: Validate CEP

Feature Description

    Scenario: Check existing zip code
      Given the user accesses the home page of the post office
      When the user enter their zip code and press the ENTER key on the keyboard
      Then it should be the first zip code rendered in the generated table