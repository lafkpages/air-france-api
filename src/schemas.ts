import {
  array,
  boolean,
  looseObject,
  number,
  object,
  objectWithRest,
  partial,
  string,
  union,
} from "valibot";

export const errorSchema = partial(
  looseObject({
    reason: string(),
  }),
);

export const portalMetadataSchema = partial(
  looseObject({
    portalVersion: string(),
    portalGitHash: string(),
    brandContext: string(),
    services: partial(
      looseObject({
        aircon: partial(
          looseObject({
            libraryPath: string(),
          }),
        ),
      }),
    ),
    i18n: partial(
      looseObject({
        defaultLanguage: string(),
        languages: array(string()),
      }),
    ),
    logger: partial(
      looseObject({
        enabled: boolean(),
        transporters: array(string()),
      }),
    ),
    analytics: partial(
      looseObject({
        google: partial(
          looseObject({
            trackingId: string(),
          }),
        ),
      }),
    ),
    links: partial(
      objectWithRest(
        {
          faq: string(),
          feedback: string(),
        },
        string(),
      ),
    ),
    features: partial(
      looseObject({
        applePay: boolean(),
        checkFlyingBlueName: boolean(),
        disruptionHandlingBot: boolean(),
        useMockData: boolean(),
        logLevelDebug: boolean(),
        logLevelLow: boolean(),
        logLevelMedium: boolean(),
        logLevelHigh: boolean(),
        newDcp: boolean(),
        myTrip: boolean(),
        coverageMap: boolean(),
        androidIntent: boolean(),
        logToGA: boolean(),
        logDcpSdk: boolean(),
        errorLogDebounce: number(),
      }),
    ),
    fbLogin: partial(
      looseObject({
        clientId: string(),
        requestUrl: string(),
        source: string(),
        viewFlag: string(),
      }),
    ),
    leaUrl: string(),
  }),
);

const originDestinationSchema = partial(
  looseObject({
    code: string(),
    name: string(),
    cityObj: partial(
      looseObject({
        code: string(),
        name: string(),
      }),
    ),
    country: partial(
      looseObject({
        code: string(),
        name: string(),
      }),
    ),
    city: string(),
  }),
);

export const flightStatusSchema = partial(
  looseObject({
    id: partial(
      looseObject({
        value: string(),
      }),
    ),
    isDelayed: boolean(),
    isCanceled: boolean(),
    departureGate: string(),
    departureTerminal: string(),
    arrivalTerminal: string(),
    baggageBelt: string(),
    translatedFlightStatus: string(),
    flightStatus: string(),
    haul: string(), // TODO: enum
    localDepartureTime: string(),
    localArrivalTime: string(),
    localDepartureDate: string(),
    localArrivalDate: string(),
    estimatedLocalDepartureTime: string(),
    estimatedLocalDepartureDate: string(),
    estimatedLocalArrivalTime: string(),
    estimatedLocalArrivalDate: string(),
    scheduledFlightDuration: string(),
    scheduledFlightDurationInMillis: number(),
    origin: originDestinationSchema,
    destination: originDestinationSchema,
    aircraft: partial(
      looseObject({
        code: string(),
        name: string(),
      }),
    ),
  }),
);

const serviceStatusSchema = partial(
  looseObject({
    status: string(),
  }),
);

export const connectivityStatusSchema = partial(
  looseObject({
    passengerInternet: partial(
      looseObject({
        healthy: boolean(),
        features: partial(
          objectWithRest(
            {
              internetConnectivity: serviceStatusSchema,
              sessionManagement: serviceStatusSchema,
            },
            serviceStatusSchema,
          ),
        ),
      }),
    ),
  }),
);

export const healthReportSchema = array(
  object({
    ...partial(
      looseObject({
        id: string(),
        version: string(),
        details: looseObject({
          buildName: string(),
          company: string(),
        }),
        heartbeatSuccess: number(),
        heartbeatFailures: number(),
        supplier: string(),
        components: array(
          partial(
            looseObject({
              id: string(),
              version: string(),
            }),
          ),
        ),
      }),
    ).entries,

    // healthy is required, so put it outside of the partial
    healthy: boolean(),
  }),
);

export const flightTrajectorySchema = partial(
  looseObject({
    departureAirportCode: string(),
    arrivalAirportCode: string(),
    plannedTrajectory: partial(
      looseObject({
        waypoints: array(
          partial(
            looseObject({
              location: partial(
                looseObject({
                  latitude: number(),
                  longitude: number(),
                }),
              ),
            }),
          ),
        ),
      }),
    ),
  }),
);

const informationalMessageSchema = union([
  partial(
    looseObject({
      key: string(),
      value: string(),
    }),
  ),
  errorSchema,
]);

export const informationalMessagesSchema = partial(
  objectWithRest(
    {
      connectivityAvailability: informationalMessageSchema,
    },
    informationalMessageSchema,
  ),
);

export const deviceStatusSchema = partial(
  looseObject({
    code: string(),
    state: string(),
    capacity: partial(
      looseObject({
        time: partial(
          looseObject({
            total: number(),
            remaining: number(),
          }),
        ),
      }),
    ),
    product: partial(
      looseObject({
        code: string(),
      }),
    ),
  }),
);

export const flightDataSchema = partial(
  looseObject({
    aircraft: partial(
      looseObject({
        tail: string(),
        type: string(),
        altitude: number(),
        latitude: number(),
        longitude: number(),
        horizontalVelocity: number(),
      }),
    ),
    flight: partial(
      looseObject({
        id: string(),
        number: string(),
        phase: string(),
        originIATA: string(),
        destinationIATA: string(),
        originUTCOffset: number(),
        destinationUTCOffset: number(),
        departureTimeUTC: number(),
        arrivalTimeUTC: number(),
        currentTimeUTC: number(),
        duration: number(),
        flightProgressTime: number(),
        timeToDestination: number(),
      }),
    ),
    connectivity: partial(
      looseObject({
        available: boolean(),
      }),
    ),
    services: partial(
      looseObject({
        passengerInternet: partial(
          looseObject({
            healthy: boolean(),
            features: partial(
              objectWithRest(
                {
                  internetConnectivity: serviceStatusSchema,
                  sessionManagement: serviceStatusSchema,
                },
                serviceStatusSchema,
              ),
            ),
          }),
        ),
        payloads: array(string()),
      }),
    ),
    arrivalInformation: partial(
      looseObject({
        baggageBelt: string(),
        terminal: string(),
      }),
    ),
  }),
);
