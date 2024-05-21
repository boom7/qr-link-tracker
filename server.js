const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const links = [
];

const maxCount = 5;
const linkCountsFile = 'linkCounts.json';

// To read the link counts from the JSON file
const readLinkCounts = () => {
  const data = fs.readFileSync(linkCountsFile, 'utf8');
  return JSON.parse(data).counts;
};

// To write the link counts to the JSON file
const writeLinkCounts = (counts) => {
  fs.writeFileSync(linkCountsFile, JSON.stringify({ counts }), 'utf8');
};

app.get('/random-link', (req, res) => {
  let linkCounts = readLinkCounts();

  const eligibleLinks = linkCounts
    .map((count, index) => ({ count, index }))
    .filter(item => item.count < maxCount);

  if (eligibleLinks.length === 0) {
    return res.status(200).json({ url: null, message: 'All links have been opened the maximum number of times.' });
  }

  const randomItem = eligibleLinks[Math.floor(Math.random() * eligibleLinks.length)];
  linkCounts[randomItem.index] += 1;

  writeLinkCounts(linkCounts);

  res.redirect(links[randomItem.index]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
