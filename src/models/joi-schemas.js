import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const TrailSpec = Joi.object()
  .keys({
        mountain: Joi.string().required().example("Mt Snowmass"),
        latitude: Joi.number().allow("").optional().example(40.01),
        longitude: Joi.number().allow("").optional().example(102.01),
        duration: Joi.number().allow("").optional().example(12),
        range: Joi.string().required().example("Front Range"),
        category: Joi.string().required().example("Class 1"),
        effort: Joi.string().required().example("Medium"),
        images: Joi.array().items(Joi.object({
          _id: IdSpec,
          img: Joi.string(),
          imgid: Joi.string(),
      })),
    collectionid: IdSpec,
  })
  .label("Trail");

export const TrailSpecPlus = TrailSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("TrailPlus");

export const TrailArraySpec = Joi.array().items(TrailSpecPlus).label("TrailArray");

export const CollectionSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Beethoven Sonatas"),
    userid: IdSpec,
    trails: TrailArraySpec,
    img: Joi.string(),
    imgid: Joi.string()
  })
  .label("Collection");

export const CollectionSpecPlus = CollectionSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CollectionSpec");

export const CollectionArraySpec = Joi.array().items(CollectionSpecPlus).label("CollectionArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");