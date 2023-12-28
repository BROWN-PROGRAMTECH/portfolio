const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");

const addService = asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  const existing = await Service.findOne({ title });

  if (existing) {
    res.status(409);
    throw new Error("Service already exists");
  }

  const service = await Service.create({
    title,
    description,
    image,
  });

  if (service) {
    res.status(200).json(service);
  } else {
    res.status(400);
    throw new Error("invalid date");
  }
});

//fetch all available Services
const services = asyncHandler(async (req, res) => {
  const services = await Service.find();
  if (!services) {
    res.status(404);
    throw new Error("There is no service available!");
  }
  res.status(200).json( services );
});

//fetch a particular services in database by its id

const service = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.status(200).json(service);
});

//update service
const updateService = asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    res.status(404);
    throw new Error("No service found");
  }

  const serviceUpdated = await Service.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      image,
    },
    {
        new: true,
        runValidator: true,
    }
  );
  serviceUpdated.save();
  console.log(req.body.title);
  res.status(202).json(serviceUpdated);
});

//delete a service
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id)
    if(!service){
        res.status(404);
        throw new Error('service not found');
    }
    await service.remove()
    res.status(200).send('Service deleted successfully')
})

module.exports = {
  addService,
  services,
  service,
  updateService,
  deleteService
};
