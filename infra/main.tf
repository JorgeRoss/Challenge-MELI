resource "aws_sqs_queue" "bid_queue" {
  name = "BidQueue"
}

resource "aws_sns_topic" "auction_events" {
  name = "AuctionEvents"
}

resource "aws_sqs_queue" "notification_queue" {
  name = "NotificationQueue"
}

resource "aws_sns_topic_subscription" "notification" {
  topic_arn = aws_sns_topic.auction_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.notification_queue.arn
} 