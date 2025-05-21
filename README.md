Darian Tan

1) For recipe project development pipeline the best place to put automated tests would be within a github action that runs whenever code is pushed sicne it makes sure that whenever code is changed the tests are ran so it catches issues, it also blocks merges if tests fail so it ensures code quality.

2) No
3) Navigation mode analyzes the webpage after it loads completely from beginning to end whereas snapshot mode analyzes the page the moment the test is ran. Snapshot can be useful for specific states where the user's done something whereas navigation will check the overall experience.
4) We should add a lang attribute in the html element, have a <meta name="viewport"> tag with width or initial-scale, and properly size the images.



