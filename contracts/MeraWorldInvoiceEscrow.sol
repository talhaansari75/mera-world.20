// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IERC20Minimal { function transfer(address to,uint256 amount) external returns(bool); function transferFrom(address from,address to,uint256 amount) external returns(bool); }
contract MeraWorldInvoiceEscrow {
 address public immutable owner; IERC20Minimal public immutable token; address public treasury;
    uint256 private locked = 1;
    modifier nonReentrant(){require(locked == 1,"REENTRANCY");locked=2;_;locked=1;}
 struct Invoice { address payer; uint256 amount; uint256 paid; uint64 expiresAt; bool released; bool refunded; }
 mapping(bytes32=>Invoice) public invoices;
 event InvoiceCreated(bytes32 indexed invoiceId,address indexed payer,uint256 amount,uint64 expiresAt);
 event PaymentReceived(bytes32 indexed invoiceId,address indexed payer,uint256 amount);
 event Released(bytes32 indexed invoiceId,uint256 amount); event Refunded(bytes32 indexed invoiceId,address indexed payer,uint256 amount);
 event TreasuryChanged(address indexed treasury);
 modifier onlyOwner(){require(msg.sender==owner,"NOT_OWNER");_;}
 constructor(IERC20Minimal token_,address treasury_){require(address(token_)!=address(0)&&treasury_!=address(0),"ZERO_ADDRESS");owner=msg.sender;token=token_;treasury=treasury_;}
 function setTreasury(address t) external onlyOwner{require(t!=address(0),"ZERO_ADDRESS");treasury=t;emit TreasuryChanged(t);}
 function createInvoice(bytes32 id,address payer,uint256 amount,uint64 expiry) external onlyOwner{require(invoices[id].amount==0,"INVOICE_EXISTS");require(payer!=address(0)&&amount>0&&expiry>block.timestamp,"INVALID_INVOICE");invoices[id]=Invoice(payer,amount,0,expiry,false,false);emit InvoiceCreated(id,payer,amount,expiry);}
 function pay(bytes32 id) external{Invoice storage i=invoices[id];require(i.amount>0,"UNKNOWN_INVOICE");require(!i.released&&!i.refunded,"INVOICE_CLOSED");require(block.timestamp<=i.expiresAt,"EXPIRED");require(msg.sender==i.payer,"WRONG_PAYER");uint256 remaining=i.amount-i.paid;require(remaining>0,"ALREADY_PAID");require(token.transferFrom(msg.sender,address(this),remaining),"TRANSFER_FAILED");i.paid+=remaining;emit PaymentReceived(id,msg.sender,remaining);}
 function release(bytes32 id) external onlyOwner{Invoice storage i=invoices[id];require(i.amount>0&&i.paid==i.amount,"NOT_FULLY_PAID");require(!i.released&&!i.refunded,"INVOICE_CLOSED");i.released=true;require(token.transfer(treasury,i.amount),"TRANSFER_FAILED");emit Released(id,i.amount);}
 function refund(bytes32 id) external onlyOwner{Invoice storage i=invoices[id];require(i.amount>0&&i.paid>0,"NOT_PAID");require(!i.released&&!i.refunded,"INVOICE_CLOSED");uint256 amount=i.paid;i.refunded=true;require(token.transfer(i.payer,amount),"TRANSFER_FAILED");emit Refunded(id,i.payer,amount);}
}