class adsModel {
    constructor(ad_id, category_id, condition_id, description, image, nim, price, status_id, title, type_id){
        this.ad_id = ad_id
        this.category_id = category_id
        this.condition_id = condition_id
        this.description = description
        this.image = image
        this.nim = nim
        this.price = price
        this.status_id = status_id
        this.title = title
        this.type_id = type_id
    }
}

module.exports = adsModel