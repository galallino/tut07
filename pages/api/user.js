// pages/api/user.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId to convert string ID to MongoDB's ObjectId

export default async (req, res) => {
  const { method } = req;
  const client = await clientPromise;
  const db = client.db("yourDatabaseName"); // Replace "yourDatabaseName" with your actual database name
  const collection = db.collection('users'); // Assuming a collection named "users"

  switch (method) {
    case 'POST':
      // Create a new user
      try {
        const user = await collection.insertOne(req.body);
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: error.toString() });
      }
      break;

    case 'GET':
      // Get a specific user by ID (passed as a query parameter)
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: error.toString() });
      }
      break;

    case 'PUT':
      // Update a user by ID
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User updated successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.toString() });
      }
      break;

    case 'DELETE':
      // Delete a user by ID
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(204).json(); // No content to send back
      } catch (error) {
        res.status(500).json({ success: false, message: error.toString() });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
