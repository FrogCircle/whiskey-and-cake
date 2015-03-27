if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })
}

//with autopublish turned off, subscribe functions are necessary to get what the server-side is
//publishing
Meteor.subscribe("CardsRoom");
