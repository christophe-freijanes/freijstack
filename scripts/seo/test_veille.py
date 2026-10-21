"""Tests hors réseau de la veille technique."""
import unittest
from datetime import UTC, datetime

from veille import classify, parse_items, render, trusted_url


class VeilleTests(unittest.TestCase):
    def test_whitelist(self):
        self.assertEqual(trusted_url("https://aws.amazon.com/example?tracking=1"), "https://aws.amazon.com/example")
        self.assertEqual(trusted_url("https://aws.amazon.com.evil.test/blog"), "")
        self.assertEqual(trusted_url("javascript:alert(1)"), "")

    def test_rss(self):
        xml = b"""<rss><channel><item><title>AWS Systems Manager maintenance window update</title>
        <link>https://aws.amazon.com/blogs/example</link>
        <description>EC2 operations update</description>
        <pubDate>Tue, 20 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>"""
        items = parse_items(xml, "AWS News", datetime(2026, 10, 20, 19, tzinfo=UTC))
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["category"], "AWS")

    def test_xss_escaped(self):
        page = render([{
            "category": "AWS",
            "title": '<img src=x onerror="alert(1)"> AWS',
            "date": "2026-10-20",
            "source": "AWS",
            "url": "https://aws.amazon.com/example",
        }])
        self.assertIn("&lt;img", page)
        self.assertNotIn("<img src=x", page)

    def test_relevance(self):
        self.assertEqual(classify("General monthly announcement", "No technical details"), None)


if __name__ == "__main__":
    unittest.main()
