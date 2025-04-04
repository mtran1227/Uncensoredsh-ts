router.post('/:id/rate', async (req, res) => {
  const { score, userEmail } = req.body;

  try {
    const bathroom = await Bathroom.findById(req.params.id);
    if (!bathroom) return res.status(404).json({ error: 'Bathroom not found' });

    // 🛑 Check if user has already rated this bathroom
    const existingRating = bathroom.ratings.find(r => r.userEmail === userEmail);
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this bathroom' });
    }

    // ✅ Add new rating
    bathroom.ratings.push({ score, userEmail });
    bathroom.updateAverage();
    await bathroom.save();

    res.json(bathroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
