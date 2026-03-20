const user = {
  name: "Alice",
  email: "test@mail.com",
  updateEmail(newEmail) {
    this.email = newEmail;
  }
};
user.updateEmail("new@mail.com");
console.log("更新後:", user.email);
