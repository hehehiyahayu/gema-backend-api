class adsModel {
    constructor(ad_id, category_id, condition_id, description, image, nim, price, status_id, title, ad_type_id, timestamp){
        this.ad_id = ad_id
        this.category_id = category_id
        this.condition_id = condition_id
        this.description = description
        this.image = image
        this.nim = nim
        this.price = price
        this.status_id = status_id
        this.title = title
        this.ad_type_id = ad_type_id
        this.timestamp = timestamp
    }
}

module.exports = adsModel