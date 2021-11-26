Feature: Validate international prices and deadlines service

Feature Description

    Scenario: Show prices and deadlines of correios international service
      Given the user accesses the home page of correios and choose the international prices and deadlines link
      When the user fill the fields with package info and click on simulate button
      Then it should be return their respective price
