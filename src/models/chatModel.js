class chatModel {
    constructor(ad_id, chat_id, message, receiver_id, sender_id, status_id){
        this.ad_id = ad_id
        this.chat_id = chat_id
        this.message = message
        this.receiver_id = receiver_id
        this.sender_id = sender_id
        this.passwstatus_idord = status_id
    }
}

module.exports = chatModel