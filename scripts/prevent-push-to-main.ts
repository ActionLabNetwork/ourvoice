const preventPushToMain = `branch=\`git symbolic-ref HEAD\`
if [ "$branch" = "refs/heads/main" ]; then
    echo "\n🚫\\033[31mDirect push to master is not allowed.\\033[0m"
    exit 1
fi`

const acknowledgePushToDev = `branch=\`git symbolic-ref HEAD\`
if [ "$branch" = "refs/heads/dev" ]; then
    echo "\n👌\\033[32mPushed to the Development branch succesfully.\\033[32m"
    exit 1
fi`
