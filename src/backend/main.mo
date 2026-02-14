import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Followers Tracking System
  type DailyList = [Text];
  type UserFollowData = Map.Map<Text, DailyList>;

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
