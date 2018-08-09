'''Copyright 2018 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.'''

from flask import request, g
from flask_restplus import Resource
from datetime import datetime
from qsystem import api, db, oidc
from app.models import Citizen, Channel, CSR, Period, PeriodState, ServiceReq, SRState
from app.schemas import ChannelSchema, ServiceReqSchema
from marshmallow import ValidationError


@api.route("/service_requests/", methods=["POST"])
class ServiceRequestsList(Resource):

    channel_schema = ChannelSchema()
    service_request_schema = ServiceReqSchema()

    @oidc.accept_token(require_token=True)
    def post(self):
        json_data = request.get_json()

        if not json_data:
            return {"message": "No input data received for creating citizen"}, 400

        csr = CSR.query.filter_by(username=g.oidc_token_info['username']).first()

        try:
            service_request = self.service_request_schema.load(json_data['service_request']).data
            channel_id = json_data['channel_id']

        except ValidationError as err:
            return {"message": err.messages}, 422
        except KeyError as err:
            return {"message": err.messages}

        channel = Channel.query.get(channel_id)
        active_sr_state = SRState.query.filter_by(sr_code='Active').first()
        service_request.channel = channel
        service_request.sr_state = active_sr_state

        db.session.add(service_request)
        db.session.flush()

        period_state_ticket_creation = PeriodState.query.filter_by(ps_name="Ticket Creation").first()

        ticket_create_period = Period(
            sr_id=service_request.sr_id,
            csr_id=csr.csr_id,
            reception_csr_ind=csr.receptionist_ind,
            channel_id=channel.channel_id,
            ps_id=period_state_ticket_creation.ps_id,
            time_start=service_request.citizen.get_service_start_time(),
            time_end=datetime.now(),
            accurate_time_ind=1
        )

        service_count = ServiceReq.query \
                .join(ServiceReq.citizen, aliased=True) \
                .filter(Citizen.start_time >= datetime.now().strftime("%Y-%m-%d")) \
                .filter_by(office_id=csr.office_id) \
                .join(ServiceReq.service, aliased=True) \
                .filter_by(prefix=service_request.service.prefix) \
                .count()

        service_request.citizen.ticket_number = service_request.service.prefix + str(service_count)

        db.session.add(ticket_create_period)
        db.session.commit()

        result = self.service_request_schema.dump(service_request)

        return {'service_request': result.data,
                'errors': result.errors}, 201