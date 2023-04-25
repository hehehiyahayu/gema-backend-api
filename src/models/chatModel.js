class chatModel {
    constructor(ad_id, message, receiver_id, sender_id, status_id, created_at){
        this.ad_id = ad_id
        this.message = message
        this.receiver_id = receiver_id
        this.sender_id = sender_id
        this.status_id = status_id
        this.created_at = created_at
    }
}

module.exports = chatModel