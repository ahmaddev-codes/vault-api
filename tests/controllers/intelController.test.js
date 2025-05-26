const {
  createIntel,
  getAllIntel,
  getAgentIntel,
  updateIntel,
  deleteIntel
} = require('../../controllers/intelController');
const Intel = require('../../models/Intel');

// Mock the Intel model
jest.mock('../../models/Intel');

describe('Intel Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      agent: {
        _id: '63f123456789abcdef123456'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createIntel', () => {
    it('should create intel successfully', async () => {
      const intelData = {
        agentId: '63f123456789abcdef123456',
        title: 'Mission Alpha',
        description: 'Top secret mission',
        location: 'Moscow'
      };
      const mockIntel = {
        _id: '63f123456789abcdef654321',
        ...intelData,
        save: jest.fn().mockResolvedValue({
          _id: '63f123456789abcdef654321',
          ...intelData
        })
      };

      req.body = intelData;
      Intel.mockImplementation(() => mockIntel);

      await createIntel(req, res);

      expect(Intel).toHaveBeenCalledWith(intelData);
      expect(mockIntel.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getAllIntel', () => {
    it('should get all intel successfully', async () => {
      const mockIntels = [
        { _id: '1', title: 'Intel 1', location: 'Location 1' },
        { _id: '2', title: 'Intel 2', location: 'Location 2' }
      ];

      Intel.find.mockResolvedValue(mockIntels);

      await getAllIntel(req, res);

      expect(Intel.find).toHaveBeenCalledWith({}, 'title details location');
      expect(res.json).toHaveBeenCalledWith(mockIntels);
    });
  });

  describe('getAgentIntel', () => {
    it('should get agent specific intel', async () => {
      const mockIntels = [
        { _id: '1', title: 'Agent Intel 1', agentId: req.agent._id }
      ];

      Intel.find.mockResolvedValue(mockIntels);

      await getAgentIntel(req, res);

      expect(res.json).toHaveBeenCalledWith(mockIntels);
    });
  });

  describe('updateIntel', () => {
    it('should update intel successfully when agent owns it', async () => {
      const updateData = {
        _id: '63f123456789abcdef654321',
        title: 'Updated Mission',
        description: 'Updated description',
        location: 'Updated location'
      };
      const mockIntel = {
        _id: updateData._id,
        agentId: req.agent._id,
        title: 'Original Mission',
        description: 'Original description',
        location: 'Original location',
        save: jest.fn().mockResolvedValue({
          ...updateData,
          agentId: req.agent._id
        })
      };

      req.body = updateData;
      Intel.findById.mockResolvedValue(mockIntel);

      await updateIntel(req, res);

      expect(Intel.findById).toHaveBeenCalled();
      expect(mockIntel.title).toBe(updateData.title);
      expect(mockIntel.description).toBe(updateData.description);
      expect(mockIntel.location).toBe(updateData.location);
      expect(mockIntel.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 when intel not found', async () => {
      req.body = { _id: 'nonexistent' };
      Intel.findById.mockResolvedValue(null);

      await updateIntel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Intel not found or unauthorized'
      });
    });

    it('should return 404 when agent does not own intel', async () => {
      const mockIntel = {
        _id: '63f123456789abcdef654321',
        agentId: 'different-agent-id'
      };

      req.body = { _id: mockIntel._id };
      Intel.findById.mockResolvedValue(mockIntel);

      await updateIntel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Intel not found or unauthorized'
      });
    });

    it('should handle server errors', async () => {
      const error = new Error('Database error');
      req.body = { _id: '63f123456789abcdef654321' };
      Intel.findById.mockRejectedValue(error);

      await updateIntel(req, res);

      expect(res.send).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: `Server Error: ${error.message}`
      });
    });
  });

  describe('deleteIntel', () => {
    it('should delete intel successfully when agent owns it', async () => {
      const mockIntel = {
        _id: '63f123456789abcdef654321',
        agentId: req.agent._id,
        remove: jest.fn().mockResolvedValue()
      };

      req.params.id = mockIntel._id;
      Intel.findById.mockResolvedValue(mockIntel);

      await deleteIntel(req, res);

      expect(Intel.findById).toHaveBeenCalledWith(req.params.id);
      expect(mockIntel.remove).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Intel removed'
      });
    });

    it('should return 404 when intel not found', async () => {
      req.params.id = 'nonexistent';
      Intel.findById.mockResolvedValue(null);

      await deleteIntel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Intel not found or unauthorized'
      });
    });

    it('should return 404 when agent does not own intel', async () => {
      const mockIntel = {
        _id: '63f123456789abcdef654321',
        agentId: 'different-agent-id'
      };

      req.params.id = mockIntel._id;
      Intel.findById.mockResolvedValue(mockIntel);

      await deleteIntel(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Intel not found or unauthorized'
      });
    });
  });
});
