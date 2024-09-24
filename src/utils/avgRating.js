export default function GetAvgRating(ratingArr) {
    // Return 0 if ratingArr is undefined or empty
    if (!ratingArr || ratingArr.length === 0) return 0;

    // Calculate total rating
    var total = 0
    for(var i=0; i<ratingArr.length; i++){
        total += ratingArr[i].rating
    }

    // Calculate average with rounding to 2 decimal places
    const multiplier = Math.pow(10, 2);
    const avgReviewCount = Math.round((total / ratingArr.length) * multiplier) / multiplier;
``
    // Log total review count

    return avgReviewCount;
}
