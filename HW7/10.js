function checkAdmin(role, callback) {
    if (role !== "admin") callback("Access Denied");
    else callback(null, "Welcome");
}

checkAdmin("user", (err, msg) => {
    if (err) console.log("錯誤:", err);
    else console.log(msg);
});

checkAdmin("admin", (err, msg) => {
    if (err) console.log("錯誤:", err);
    else console.log(msg);
});
