import express from 'express';
import { nanoid } from 'nanoid';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { createShortURL, getUrlByCode, getAllUrlsByUserId, deleteUrlById } from '../services/url.service.js';

const router = express.Router();


// POST /shorten — create a short URL (auth required)
router.post('/shorten', requireAuth, async (req, res) => {
    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) return res.status(400).json({ error: validationResult.error.issues });

    const { url, code } = validationResult.data;
    const shortCode = code ?? nanoid(6);

    const result = await createShortURL({
        shortCode,
        targetURL: url,
        userId: req.user.id,
    });

    return res.status(201).json(result);
});


// GET /urls — list all URLs for the logged-in user
router.get('/urls', requireAuth, async (req, res) => {
    const urls = await getAllUrlsByUserId(req.user.id);
    return res.json({ urls });
});


// GET /:shortCode — redirect to the original URL
router.get('/:shortCode', async (req, res) => {
    const result = await getUrlByCode(req.params.shortCode);
    if (!result) return res.status(404).json({ error: 'URL not found' });

    return res.redirect(result.targetURL);
});


// DELETE /:id — delete a URL (only if it belongs to the user)
router.delete('/:id', requireAuth, async (req, res) => {
    const deleted = await deleteUrlById(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'URL not found' });

    return res.json({ deleted: true });
});


export default router;
