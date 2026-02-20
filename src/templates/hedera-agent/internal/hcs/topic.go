package hcs

import (
	"context"

	"github.com/hashgraph/hedera-sdk-go/v2"
)

func (c *Client) CreateTopic(ctx context.Context, memo string) (hedera.TopicID, error) {
	tx, err := hedera.NewTopicCreateTransaction().
		SetTopicMemo(memo).
		Execute(c.hedera)
	if err != nil {
		return hedera.TopicID{}, err
	}

	receipt, err := tx.GetReceipt(c.hedera)
	if err != nil {
		return hedera.TopicID{}, err
	}

	return *receipt.TopicID, nil
}

func (c *Client) SubmitMessage(ctx context.Context, topicID hedera.TopicID, message []byte) error {
	_, err := hedera.NewTopicMessageSubmitTransaction().
		SetTopicID(topicID).
		SetMessage(message).
		Execute(c.hedera)
	return err
}
