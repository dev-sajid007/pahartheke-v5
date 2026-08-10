import { Router } from 'express';
import LandingPage from '../models/LandingPage.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { pageName, isPublished } = req.query;
    const filter = {};

    if (pageName) filter.pageName = pageName;
    if (isPublished) filter.isPublished = isPublished === 'true';

    const pages = await LandingPage.find(filter).sort({ pageName: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const page = await LandingPage.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Landing page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = await LandingPage.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = await LandingPage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!page) return res.status(404).json({ success: false, message: 'Landing page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const page = await LandingPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Landing page not found' });
    res.json({ success: true, message: 'Landing page deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
