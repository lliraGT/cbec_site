import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { userId, week, month, year } = req.query;
        
        // Construct query based on parameters
        let query = `*[_type == "mciProgress"`;
        const params = {};
        
        if (userId) {
          query += ` && user._ref == $userId`;
          params.userId = userId;
        }
        if (week) {
          query += ` && week == $week`;
          params.week = parseInt(week);
        }
        if (month) {
          query += ` && month == $month`;
          params.month = parseInt(month);
        }
        if (year) {
          query += ` && year == $year`;
          params.year = parseInt(year);
        }
        
        query += `]{
          _id,
          week,
          month,
          year,
          taskProgress,
          "user": user->{ _id, name, email, role }
        }`;

        const progress = await client.fetch(query, params);
        res.status(200).json(progress);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress data' });
      }
      break;

    case 'POST':
      try {
        const { userId, week, month, year, taskProgress } = req.body;

        // Check if entry already exists
        const existingEntry = await client.fetch(
          `*[_type == "mciProgress" && user._ref == $userId && week == $week && month == $month && year == $year][0]`,
          { userId, week, month, year }
        );

        if (existingEntry) {
          // Update existing entry
          const updated = await client
            .patch(existingEntry._id)
            .set({ taskProgress })
            .commit();
          res.status(200).json(updated);
        } else {
          // Create new entry
          const doc = {
            _type: 'mciProgress',
            user: {
              _type: 'reference',
              _ref: userId
            },
            week,
            month,
            year,
            taskProgress
          };
          const created = await client.create(doc);
          res.status(201).json(created);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to save progress data' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}