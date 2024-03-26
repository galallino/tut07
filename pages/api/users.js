// pages/api/users.js
import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  const { method } = req;

  const client = await clientPromise;
  const db = client.db('yourDatabaseName');

  switch (method) {
    case 'GET':
      try {
        const users = await db.collection('users').find({}).toArray();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
