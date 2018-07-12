/* eslint-disable */

const s3   = require('gulp-s3')
const gulp = require('gulp')
const cloudfront = require('gulp-cloudfront-invalidate');
const prod = process.env.NODE_ENV === 'production';
const {version} = require('./package.json');

const AWS = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: prod ? 'cdn.canner.io' : 'cdn-staging.canner.io',
  region: 'ap-northeast-1'
}

const invalidateSettings = {
  distribution: prod ? "E3PDJG9TBCBWU0" : "E3J89R1Q1013K5", // Cloudfront distribution ID
  paths: [`/antd/${version}*`], // Paths to invalidate
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Access Key
  wait: true // Whether to wait until invalidation is completed (default: false)
};

const option = {
  headers: {
    'x-amz-acl': 'public-read'
  },
  uploadPath: `antd/${version}/`
};

gulp.task('default', () => {
  gulp.src('./dist/**').pipe(s3(AWS, option));
});

gulp.task('invalidate', function() {
  return gulp.src("*")
    .pipe(cloudfront(invalidateSettings));
});
