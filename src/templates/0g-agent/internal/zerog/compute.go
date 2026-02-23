package zerog

import (
	"context"
	"fmt"
)

// ComputeBroker submits inference tasks to the 0G Compute network.
// Replace the stub body with the actual 0G Compute SDK call when available.
type ComputeBroker struct {
	endpoint string
}

// NewComputeBroker creates a broker pointed at the given compute endpoint.
func NewComputeBroker(endpoint string) *ComputeBroker {
	return &ComputeBroker{endpoint: endpoint}
}

// SubmitTask sends payload to the 0G Compute broker and returns a task ID.
func (b *ComputeBroker) SubmitTask(ctx context.Context, payload []byte) (string, error) {
	if err := ctx.Err(); err != nil {
		return "", err
	}
	// TODO: replace with actual 0G Compute SDK call
	// e.g. client.Submit(ctx, &computepb.TaskRequest{Payload: payload})
	return fmt.Sprintf("task-%x", payload[:min(4, len(payload))]), nil
}
