# Marble Token
This box helps to create a basic Ethereum non fungible token (NFT) with truffle, openzeppelin and reactjs frameworks.

## Features

Create a Marble token by giving it a unique:
* Shape
* Color
* Name

You can then trade those tokens just like any other NFT.

## Installation

First ensure you are in a new and empty directory.

1. Run the `unbox` command via `npx` and skip to step 3. This will install all necessary dependencies.
   ```js
   npx truffle unbox koshikraj/marble-token
   ```

2. Alternatively, you can install Truffle globally and run the `unbox` command.
    ```javascript
    npm install -g truffle
    truffle unbox koshikraj/marble-token
    ```

3. Compile and migrate the smart contracts using truffle.
    ```javascript
    truffle compile
    truffle migrate
    ```

4. Truffle can run tests written in JavaScript Mocha and Chai test framework against your smart contracts.
    ```javascript
    // outside the development console..
    truffle test
    ```

5. In the `client` directory, we run the React frontend app.
    ```javascript
    cd client
    npm run start
    ```

6. To build the application for production, use the build script. A production build will be in the `client/build` folder.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run build
    ```
    
## Contributing

You are welcome to submit issues and enhancement requests and work on any of the existing issues. Follow this simple guide to contribute to the repository.

 1. **Create** or pick an existing issue to work on
 2. **Fork** the repo on GitHub
 3. **Clone** the forked project to your own machine
 4. **Commit** changes to your own branch
 5. **Push** your work back up to your forked repo
 6. Submit a **Pull request** from the forked repo to our repo so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

## Credits

 * **Marble Token** project is inspired by [NFT Tutorial](https://github.com/dappuniversity/nft) by [dappuniversity](https://github.com/dappuniversity)
