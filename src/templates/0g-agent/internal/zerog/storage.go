package zerog

import (
	"context"
	"fmt"
)

// StorageClient uploads and downloads data from the 0G Storage network.
// Replace stub bodies with the actual 0G Storage SDK calls when available.
type StorageClient struct {
	endpoint string
}

// NewStorageClient creates a client pointed at the given storage endpoint.
func NewStorageClient(endpoint string) *StorageClient {
	return &StorageClient{endpoint: endpoint}
}

// Upload stores data on 0G Storage and returns the content ID.
func (s *StorageClient) Upload(ctx context.Context, data []byte) (string, error) {
	if err := ctx.Err(); err != nil {
		return "", err
	}
	// TODO: replace with actual 0G Storage SDK call
	return fmt.Sprintf("cid-%x", data[:min(4, len(data))]), nil
}

// Download retrieves data by content ID from 0G Storage.
func (s *StorageClient) Download(ctx context.Context, cid string) ([]byte, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	// TODO: replace with actual 0G Storage SDK call
	return []byte("stub-data-for-" + cid), nil
}
