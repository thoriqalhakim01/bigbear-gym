<?php
namespace App;

enum PaymentMethod: string {
    case BANK_TRANSFER = 'bank_transfer';
    case CASH          = 'cash';
    case CREDIT_CARD   = 'credit_card';
    case E_WALLET      = 'e_wallet';
    case QRIS          = 'qris';
}
