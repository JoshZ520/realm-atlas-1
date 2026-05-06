/**
 * Integration tests for Regions API
 * T046, T047 — requires a running test database
 */

describe("GET /api/worlds/:worldId/regions", () => {
  it.todo(
    "given_world_owner_when_list_regions_then_returns_regions_with_event_counts"
  );
  it.todo(
    "given_world_owner_with_no_regions_when_list_regions_then_returns_empty_array"
  );
  it.todo(
    "given_other_user_when_list_regions_then_returns_403"
  );
  it.todo(
    "given_unauthenticated_user_when_list_regions_then_returns_401"
  );
});

describe("POST /api/worlds/:worldId/regions", () => {
  it.todo(
    "given_world_owner_when_create_region_with_valid_name_then_returns_201"
  );
  it.todo(
    "given_world_owner_when_create_region_without_name_then_returns_400"
  );
  it.todo(
    "given_other_user_when_create_region_then_returns_403"
  );
});

describe("PUT /api/worlds/:worldId/regions/:regionId", () => {
  it.todo(
    "given_world_owner_when_update_region_then_returns_200_with_updated_region"
  );
  it.todo(
    "given_other_user_when_update_region_then_returns_403"
  );
  it.todo(
    "given_nonexistent_region_when_update_then_returns_404"
  );
});

describe("DELETE /api/worlds/:worldId/regions/:regionId", () => {
  it.todo(
    "given_world_owner_when_delete_region_then_returns_204_and_region_gone"
  );
  it.todo(
    "given_delete_region_with_events_when_confirmed_then_cascade_deletes_events"
  );
  it.todo(
    "given_other_user_when_delete_region_then_returns_403"
  );
});
