Feature: Validate wrong CEP

Feature Description

    Scenario: Check the missing zip code
      Given the user accesses the inital page of the post office
      When the user enter with wrong zip code and press the ENTER key on the keyboard
      Then it should be rendered a error message