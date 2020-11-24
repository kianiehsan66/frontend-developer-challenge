# how to make this app scalable

This is all based on my little experience with React and I'm sure there is a lot more ways than the ones that I mentioned below.

 - Make a proper folder structure(for example in my opinion all interfaces must put in a single folder)
 - Set a standard naming convention
 - Use a more advanced package for calling API(e.g. AXIOS)
 - Change the back-end structure because right now it's not truly based on REST, maybe it is a way to make challenge more difficult(e.g. /authors/:authorId/videos)
 - Write unit tests
 - Set some rules for separating logic from UI(e.g. in Angular I used MVP)
 - Share common logic and components between projects using libraries(this helps decoupling)
 - Define a set of rules for using hooks in order to share logic(e.g. https://bit.dev/nsebhastian/tutorial-examples/sharing-with-hooks?example=5f4676ef81090a0019cb4ed2)
 -  Avoid Single Point of Failure (e.g. [Centralized Error Handing with React and Redux | Pluralsight](https://www.pluralsight.com/guides/centralized-error-handing-with-react-and-redux))
 - Use a logging solution (e.g. https://sentry.io/for/react/)