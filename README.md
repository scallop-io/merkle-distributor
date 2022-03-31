# merkle-distributor

[![Crates.io](https://img.shields.io/crates/v/merkle-distributor)](https://crates.io/crates/merkle-distributor)
[![License](https://img.shields.io/crates/l/merkle-distributor)](https://github.com/saber-hq/merkle-distributor/blob/master/LICENSE.txt)
[![Build Status](https://img.shields.io/github/workflow/status/saber-hq/merkle-distributor/Rust/master)](https://github.com/saber-hq/merkle-distributor/actions/workflows/rust.yml?query=branch%3Amaster)
[![Contributors](https://img.shields.io/github/contributors/saber-hq/merkle-distributor)](https://github.com/saber-hq/merkle-distributor/graphs/contributors)

<p align="center">
    <img src="https://raw.githubusercontent.com/saber-hq/merkle-distributor/master/images/merkle-distributor.png" />
</p>

A program for distributing tokens efficiently via uploading a [Merkle root](https://en.wikipedia.org/wiki/Merkle_tree).

This program is largely based off of [Uniswap's Merkle Distributor](https://github.com/Uniswap/merkle-distributor).

## Rationale

Although Solana has low fees for executing transactions, it requires staking tokens to pay for storage costs, also known as "rent". These rent costs can add up when sending tokens to thousands or tens of thousands of wallets, making it economically unreasonable to distribute tokens to everyone.

The Merkle distributor, pioneered by [Uniswap](https://github.com/Uniswap/merkle-distributor), solves this issue by deriving a 256-bit "root hash" from a tree of balances. This puts the gas cost on the claimer. Solana has the additional advantage of being able to reclaim rent from closed token accounts, so the net cost to the user should be around `0.000010 SOL` (at the time of writing).

The Merkle distributor is also significantly easier to manage from an operations perspective, since one does not need to send a transaction to each individual address that may be redeeming tokens.

## License

The Merkle distributor program and SDK is distributed under the GPL v3.0 license.


### How to use

- build environment:

    - step. 1: build environment
    
        ```bash
            # install solana tool
            sh -c "$(curl -sSfL https://release.solana.com/v1.9.1/install)"
            # install anchor tool
            curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
            source $HOME/.cargo/env
            rustup component add rustfmt

            npm install -g yarn

            npm i -g @project-serum/anchor-cli

            cargo install --git https://github.com/project-serum/anchor --tag v0.23.0 anchor-cli --locked

            sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev (linux)
        ```

    - step. 2: install package

        ```bash
            npm install

            npm run idl:generate
        ```

- prepare before run scripts:

    - step. 1: create mint token or import exist mint token

        ```bash
            # create
            solana-keygen new -o ~/.config/solana/markle-test-mint.json
            spl-token create-token ~/.config/solana/markle-test-mint.json --decimal 6
            spl-token create-account MINT_PUBLICKEY
            spl-token mint GwRRr2LMa7FC4JnCDxdGdnzTFaUCKaHZc9jsGgYze5Eh 1000

            # import
            cp ./keypair.json ~/.config/solana/markle-test-mint.json

        ```

    - step. 2: create env file

        ```bash
            # create .env

            touch .env

            # edit .env
            vim .env

            # .env Content:
            # MINT_KEYFILE=~/.config/solana/markle-test-mint.json
            # RPC_URL=https://api.mainnet-beta.solana.com | https://api.devnet.solana.com

            # export env
            . .env
        ```

- run scripts:

    - step. 1: modify airdrop list

        ```bash
            vim ./data/airdrop-amounts.json
        ```

    - step. 2: create distributor account

        ```bash
            npx ts-node ./scripts/create-distributor.ts

            # sava ouput distributor data
            # {
            #     "bump": 255,
            #     "distributor": "8yd6brK4ryY34r6DeKM64jrnpQpW7qv7ZheLtKF6yrus",
            #     "distribtuorATA": "GUfFUwCjwrDCZudJrCjLzWhXcsECSGzzjpaCnpBLptsX"
            # }
        ```

    - step. 3: generate Merkle tree json file

        ```bash
            npx ts-node ./scripts/generate-distributor-info.ts

            # save `./data/distributor-info.json` file
        ```

- after scripts:

    - step. 1: transfer token to distribtuorATA
    
        ```bash
            # check mint address
            solana-keygen pubkey ~/.config/solana/markle-test-mint.json

            # transfer token
            spl-token transfer MINT_ADDRESS amount DISTRIBTUORATA
        ```
