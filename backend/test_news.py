import requests
import xml.etree.ElementTree as ET

url = "https://news.google.com/rss/search?q=Himachal+Pradesh+flood&hl=en-IN&gl=IN&ceid=IN:en"
res = requests.get(url)
root = ET.fromstring(res.text)
for item in root.findall('.//item')[:3]:
    print(item.find('title').text)
    print(item.find('link').text)
    print(item.find('pubDate').text)
