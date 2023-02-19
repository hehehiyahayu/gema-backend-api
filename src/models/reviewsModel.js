class reviewsModel {
    constructor(review_id, ad_id, description, image, nim, rating){
        this.review_id = review_id
        this.ad_id = ad_id
        this.description = description
        this.image = image
        this.nim = nim
        this.rating = rating
    }
}

module.exports = reviewsModel