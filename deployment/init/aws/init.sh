#!/usr/bin/env bash
awslocal s3 mb s3://test-bucket
awslocal s3api put-bucket-cors --bucket test-bucket --cors-configuration file://s3-config.json
