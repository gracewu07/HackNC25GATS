from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/login")
def index():
    return render_template("login.j2")

@app.route("/dashboard/<uid>")
def dashboard(uid):
    username = request.args.get("username", "User")
    total_saved = request.args.get("total_saved", "0")
    return render_template("home.j2", username=username, total_saved=total_saved)





@app.route("/online_discounts")
def online_discounts():
    return render_template("online.j2")


@app.route("/physical_discounts")
def physical_discounts():
    return render_template("physical.j2")


@app.route("/friends")
def friends():
    return render_template("friends.j2")


if __name__ == "__main__":
    app.run(debug=True)
