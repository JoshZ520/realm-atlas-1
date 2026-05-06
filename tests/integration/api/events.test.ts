/**
 * Integration tests for Events API
 * T056, T057 — requires a running test database
 */

describe("POST /api/worlds/:worldId/regions/:regionId/events", () => {
  it.todo(
    "given_region_owner_when_create_event_with_title_and_description_then_returns_201"
  );
  it.todo(
    "given_region_owner_when_create_event_without_title_then_returns_400"
  );
  it.todo(
    "given_region_owner_when_create_event_without_description_then_returns_400"
  );
  it.todo(
    "given_other_user_when_create_event_then_returns_403"
  );
  it.todo(
    "given_unauthenticated_user_when_create_event_then_returns_401"
  );
});

describe("GET /api/worlds/:worldId/events (cross-region)", () => {
  it.todo(
    "given_world_owner_when_get_all_events_then_returns_events_from_all_regions_with_region_name"
  );
  it.todo(
    "given_world_owner_when_filter_by_status_active_then_returns_only_active_events"
  );
  it.todo(
    "given_world_owner_when_filter_by_regionId_then_returns_only_that_regions_events"
  );
  it.todo(
    "given_no_matching_events_when_filter_by_status_then_returns_empty_array"
  );
  it.todo(
    "given_other_user_when_get_events_then_returns_403"
  );
});

describe("GET /api/worlds/:worldId/regions/:regionId/events", () => {
  it.todo(
    "given_region_owner_when_list_events_then_returns_events_for_that_region"
  );
  it.todo(
    "given_region_owner_when_filter_by_status_then_returns_filtered_events"
  );
});

describe("PUT /api/worlds/:worldId/regions/:regionId/events/:eventId", () => {
  it.todo(
    "given_event_owner_when_update_title_then_returns_200_with_updated_event"
  );
  it.todo(
    "given_other_user_when_update_event_then_returns_403"
  );
  it.todo(
    "given_nonexistent_event_when_update_then_returns_404"
  );
});

describe("DELETE /api/worlds/:worldId/regions/:regionId/events/:eventId", () => {
  it.todo(
    "given_event_owner_when_delete_event_then_returns_204_and_event_gone"
  );
  it.todo(
    "given_other_user_when_delete_event_then_returns_403"
  );
});
