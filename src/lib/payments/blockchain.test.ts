import test from "node:test";
import assert from "node:assert/strict";
import {
  ERC20_TRANSFER_TOPIC,
  hasMatchingErc20Transfer,
  hexToBigInt,
} from "./blockchain.ts";

const padTopic = (address: string) => "0x" + "0".repeat(24) + address.slice(2).toLowerCase();

test("hexToBigInt rejects malformed quantities", () => {
  assert.throws(() => hexToBigInt("12"));
});

test("ERC20 transfer matcher accepts the exact payer recipient and amount", () => {
  const payer = "0x1111111111111111111111111111111111111111";
  const recipient = "0x2222222222222222222222222222222222222222";
  const token = "0x3333333333333333333333333333333333333333";
  const amount = 1990000n;
  assert.equal(
    hasMatchingErc20Transfer(
      [{ address: token, topics: [ERC20_TRANSFER_TOPIC, padTopic(payer), padTopic(recipient)], data: "0x" + amount.toString(16).padStart(64, "0") }],
      token,
      payer,
      recipient,
      amount,
    ),
    true,
  );
});

test("ERC20 transfer matcher rejects a wrong amount", () => {
  const payer = "0x1111111111111111111111111111111111111111";
  const recipient = "0x2222222222222222222222222222222222222222";
  const token = "0x3333333333333333333333333333333333333333";
  assert.equal(
    hasMatchingErc20Transfer(
      [{ address: token, topics: [ERC20_TRANSFER_TOPIC, padTopic(payer), padTopic(recipient)], data: "0x" + (1990001n).toString(16).padStart(64, "0") }],
      token,
      payer,
      recipient,
      1990000n,
    ),
    false,
  );
});
