import { client } from '@/lib/sanity';

export default async function handler(req, res) {
  try {
    // Simple query to test connection
    const result = await client.fetch(`*[_type == "user"][0...10]`);
    res.status(200).json({ 
      success: true, 
      message: 'Connected successfully',
      data: result 
    });
  } catch (error) {
    console.error('Sanity test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}