const knex = require('../db/connection')
// const mapProperties = require('../utils/map-properties')
const tableName = "reviews";

async function destroy(reviewId) {
  return knex(tableName).where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  return knex(tableName)
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(setCritic)));
}

async function read(reviewId) {
  return knex(tableName).where({ review_id: reviewId }).first();
}

async function read(reviewId) {
  return knex('reviews').select('*').where({ review_id: reviewId }).first();
}

async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

function update(review) {
  return knex(tableName)
  .where({ review_id: review.review_id })
  .update(review, "*")
  .then(() => read(review.review_id))
  .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
} 

// const addCriticDetails = mapProperties({
//   preferred_name: 'critic.preferred_name',
//   surname: 'critic.surname',
//   organization_name: 'critic.organization_name',
// });

// function getReviewWithCritic(reviewId) {
//   return knex('reviews as r')
//   .join('critics as c', 'r.critic_id', 'c.critic_id')
//   .select('*')
//   .where({ review_id: reviewId })
//   .first()
//   .then((result) => {
//     const updatedReview = addCriticDetails(result)
//     return updatedReview;
//   });
// }

