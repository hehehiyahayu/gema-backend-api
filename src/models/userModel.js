class userModel {
    constructor(avatar, email, full_name, ktm_image, nim, password, phone_number, token, username){
        this.avatar = avatar
        this.email = email
        this.full_name = full_name
        this.ktm_image = ktm_image
        this.nim = nim
        this.password = password
        this.phone_number = phone_number
        this.token = token
        this.username = username
    }
}

module.exports = userModel