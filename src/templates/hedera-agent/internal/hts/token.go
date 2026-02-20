package hts

import (
	"github.com/hashgraph/hedera-sdk-go/v2"
)

func (c *Client) TokenInfo(tokenID hedera.TokenID) (*hedera.TokenInfo, error) {
	info, err := hedera.NewTokenInfoQuery().
		SetTokenID(tokenID).
		Execute(c.hedera)
	if err != nil {
		return nil, err
	}
	return &info, nil
}

func (c *Client) AccountBalance(accountID hedera.AccountID) (map[hedera.TokenID]uint64, error) {
	balance, err := hedera.NewAccountBalanceQuery().
		SetAccountID(accountID).
		Execute(c.hedera)
	if err != nil {
		return nil, err
	}
	return balance.Tokens.ToMap(), nil
}
