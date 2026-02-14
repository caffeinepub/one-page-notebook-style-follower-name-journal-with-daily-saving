import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type DailyList = [Text];
  type UserFollowData = Map.Map<Text, DailyList>; // Date -> List

  let followersData = Map.empty<Principal, UserFollowData>();

  public query ({ caller }) func getFollowersForDay(date : Text) : async DailyList {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access followers list for a day");
    };
    switch (followersData.get(caller)) {
      case (?userData) {
        switch (userData.get(date)) {
          case (?list) { list };
          case (null) { [] };
        };
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveFollowersForDay(date : Text, list : DailyList) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save followers list for a day");
    };

    let userData = switch (followersData.get(caller)) {
      case (?existing) {
        existing.add(date, list);
        existing;
      };
      case (null) {
        let newMap = Map.empty<Text, DailyList>();
        newMap.add(date, list);
        newMap;
      };
    };

    followersData.add(caller, userData);
  };
};
